-- Create a helper function to get enum values
CREATE OR REPLACE FUNCTION get_enum_values()
RETURNS TABLE(enum_name text, enum_values text[]) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.typname::text AS enum_name,
        array_agg(e.enumlabel ORDER BY e.enumsortorder)::text[] AS enum_values
    FROM 
        pg_type t 
        JOIN pg_enum e ON t.oid = e.enumtypid  
    WHERE 
        t.typname IN ('task_status', 'task_priority', 'priority', 'status')
    GROUP BY t.typname;
END;
$$ LANGUAGE plpgsql;
