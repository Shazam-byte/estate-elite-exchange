const { data: { user } } = await supabase.auth.getUser(); console.log(user);
