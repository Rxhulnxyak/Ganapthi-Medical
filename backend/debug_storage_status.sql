
-- Check if bucket exists and is public
select id, name, public from storage.buckets where id = 'prescriptions';

-- Check policies on storage.objects
select * from pg_policies where schemaname = 'storage' and tablename = 'objects';

-- List files in the bucket (to confirm uploads happened)
select name, id, bucket_id, created_at from storage.objects where bucket_id = 'prescriptions' order by created_at desc limit 5;
