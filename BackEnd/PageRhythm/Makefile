postgres:
	docker run --name postgres12 -p 5432:5432 -e POSTGRES_PASSWORD=cs300 -d postgres:12-alpine

createdb:
	docker exec -it postgres12 createdb --username=root --owner=root page_rhythm

dropdb:
	docker exec -it postgres12 dropdb page_rhythm

migrateup:
	migrate -path db/migration -database "postgresql://root:cs300@localhost:5432/page_rhythm?sslmode=disable" -verbose up

migratedown:
	migrate -path db/migration -database "postgresql://root:cs300@localhost:5432/page_rhythm?sslmode=disable" -verbose down

.PHONY: createdb dropdb postgres migrateup migratedown