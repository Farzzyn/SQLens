-- Run this in your Supabase SQL Editor to enable the sandbox function

create or replace function exec_sql(query_text text)
returns json
language plpgsql
security definer
as $$
declare
  result json;
begin
  -- Execute the query and convert result to JSON
  execute 'select json_agg(t) from (' || query_text || ') t' into result;
  
  -- If no rows returned, return empty array instead of null
  if result is null then
    result := '[]'::json;
  end if;
  
  return result;
exception when others then
  -- Return error details as JSON object
  return json_build_object('error', SQLERRM);
end;
$$;
