-- Check the enum types defined in the database
SELECT 
    t.typname AS enum_name,
    e.enumlabel AS enum_value
FROM 
    pg_type t 
    JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE 
    t.typname IN ('task_status', 'task_priority', 'priority')
ORDER BY 
    t.typname, e.enumsortorder;

-- Also check the column definitions
SELECT 
    table_name,
    column_name,
    data_type,
    udt_name
FROM 
    information_schema.columns 
WHERE 
    table_name = 'tasks' 
    AND column_name IN ('status', 'priority')
ORDER BY 
    table_name, column_name;
