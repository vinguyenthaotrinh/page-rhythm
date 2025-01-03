CREATE TABLE "Account" (
    "account_id"                bigserial     PRIMARY KEY,
    "email"                     varchar(255)  UNIQUE NOT NULL,
    "full_name"                 varchar(255),
    "first_name"                varchar(100),
    "last_name"                 varchar(100),
    "birthday"                  date,
    "bio"                       text,
    "salt"                      varchar(255) NOT NULL,
    "hashed_password"           varchar(255) NOT NULL,
    "account_type"              varchar(50),
    "profile_picture"           text
);

CREATE TABLE "BannedAccount" (
    "banned_account_id"         bigserial PRIMARY KEY NOT NULL,
    "banning_account_id"        bigserial NOT NULL,
    "ban_type"                  text,
    "start_time"                timestamp,
    "end_time"                  timestamp
);

CREATE TABLE "Book" (
    "book_id"                   bigserial PRIMARY KEY,
    "title"                     varchar(255),
    "author"                    varchar(255),
    "summary"                   text,
    "genre"                     varchar(100),
    "owner_id"                  bigserial NOT NULL,
    "content"                   text,
    "released_date"             date, 
    "book_rating"               float DEFAULT 0,
    "image"                     text;
    "hidden"                    boolean DEFAULT false
);

CREATE TABLE "BookRating" (
    "user_id"                   bigserial NOT NULL,
    "book_id"                   bigserial NOT NULL,
    "rating"                    smallint,
    "date"                      date,
    PRIMARY KEY ("user_id", "book_id")
);

CREATE TABLE "TrackedProgress" (
    "user_id"                         bigserial NOT NULL,
    "book_id"                         bigserial NOT NULL,
    "page_number"                     int,
    "status"                          text NOT NULL DEFAULT "in_progress" CHECK (status IN ("in_progress", "not_started", "finished")),
    "most_recent_update_date"         timestamp,
    PRIMARY KEY ("user_id", "book_id")
);

CREATE TABLE "SampleAudioFile" (
    "sample_audio_file_id"      bigserial PRIMARY KEY,
    "file_name"                 text,
    "description"               text,
    "owner_id"                  bigserial NOT NULL,
    "content"                   text,
    "upload_time"               timestamp,
    "file_extension"            text
);

CREATE TABLE "Comment" (
    "comment_id"                bigserial PRIMARY KEY,
    "book_id"                   bigserial NOT NULL,
    "comment_author_id"         bigserial NOT NULL,
    "replied_comment_id"        bigserial,
    "content"                   text,
    "create_time"               timestamptz
);

CREATE TABLE "TextToSpeechGeneration" (
    "id"                        bigserial PRIMARY KEY,
    "account_id"                bigserial NOT NULL,
    "generation_time"           timestamp,
    "text_content"              text,
    "speech_content"            text
);

ALTER TABLE "Book" ADD FOREIGN KEY ("owner_id")                     REFERENCES "Account" ("account_id");

ALTER TABLE "BookRating" ADD FOREIGN KEY ("user_id")                REFERENCES "Account" ("account_id");

ALTER TABLE "BookRating" ADD FOREIGN KEY ("book_id")                REFERENCES "Book" ("book_id");

ALTER TABLE "TrackedProgress" ADD FOREIGN KEY ("user_id")           REFERENCES "Account" ("account_id");

ALTER TABLE "TrackedProgress" ADD FOREIGN KEY ("book_id")           REFERENCES "Book" ("book_id");

ALTER TABLE "SampleAudioFile" ADD FOREIGN KEY ("owner_id")          REFERENCES "Account" ("account_id");

ALTER TABLE "Comment" ADD FOREIGN KEY ("book_id")                   REFERENCES "Book" ("book_id");

ALTER TABLE "Comment" ADD FOREIGN KEY ("comment_author_id")         REFERENCES "Account" ("account_id");

ALTER TABLE "Comment" ADD FOREIGN KEY ("replied_comment_id")        REFERENCES "Comment" ("comment_id");

ALTER TABLE "BannedAccount" ADD FOREIGN KEY ("banned_account_id")   REFERENCES "Account" ("account_id");

ALTER TABLE "BannedAccount" ADD FOREIGN KEY ("banning_account_id")  REFERENCES "Account" ("account_id");

ALTER TABLE "TextToSpeechGeneration" ADD FOREIGN KEY ("account_id") REFERENCES "Account" ("account_id");