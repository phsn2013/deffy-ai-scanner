import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CaktoWebhookPayload {
  email: string;
  name?: string;
  transaction_id?: string;
  plan?: string;
  // Adicione outros campos que a Cakto envia
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received webhook from Cakto');

    // Validar webhook secret da Cakto
    const webhookSecret = Deno.env.get('CAKTO_WEBHOOK_SECRET');
    const receivedSecret = req.headers.get('x-webhook-secret') || req.headers.get('authorization');
    
    if (webhookSecret && receivedSecret !== webhookSecret) {
      console.error('Invalid webhook secret');
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse webhook payload
    const payload: CaktoWebhookPayload = await req.json();
    console.log('Webhook payload:', payload);

    if (!payload.email) {
      throw new Error('Email não fornecido no webhook');
    }

    // Create Supabase Admin client (usa service role key para criar usuários)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Senha padrão - você pode mudar isso
    const defaultPassword = Deno.env.get('DEFAULT_USER_PASSWORD') || 'MudeSenha123!';

    console.log('Creating user account for:', payload.email);

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: payload.email,
      password: defaultPassword,
      email_confirm: true, // Confirma email automaticamente
      user_metadata: {
        full_name: payload.name || '',
        created_from: 'cakto_purchase',
        transaction_id: payload.transaction_id || '',
        plan: payload.plan || 'mensal'
      }
    });

    if (authError) {
      console.error('Error creating user:', authError);
      
      // Se usuário já existe, você pode optar por apenas retornar sucesso
      if (authError.message.includes('already registered')) {
        console.log('User already exists, skipping creation');
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Usuário já existe',
            email: payload.email 
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      throw authError;
    }

    console.log('User created successfully:', authData.user.id);

    // Opcional: Enviar email com as credenciais
    // Você pode integrar com Resend aqui se quiser

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Conta criada com sucesso',
        user_id: authData.user.id,
        email: payload.email
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
