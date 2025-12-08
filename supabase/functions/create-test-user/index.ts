import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const testEmail = 'teste@menteforte.com';
    const testPassword = 'Teste@123456';
    const testDisplayName = 'Usuário Teste';

    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUser?.users.some((u) => u.email === testEmail);

    if (userExists) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Usuário de teste já existe',
          credentials: {
            email: testEmail,
            password: testPassword,
          },
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: {
        display_name: testDisplayName,
      },
    });

    if (authError) {
      throw authError;
    }

    if (authData.user) {
      const { error: profileError } = await supabaseAdmin.from('profiles').insert({
        id: authData.user.id,
        email: testEmail,
        display_name: testDisplayName,
        xp: 0,
        level: 1,
        current_streak: 0,
        longest_streak: 0,
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Usuário de teste criado com sucesso!',
        credentials: {
          email: testEmail,
          password: testPassword,
        },
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Erro ao criar usuário de teste',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});