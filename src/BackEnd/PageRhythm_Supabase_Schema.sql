create table
  public."Account" (
    account_id      bigserial not null,
    email           text not null,
    full_name       text null,
    first_name      text null,
    last_name       text null,
    birthday        date null,
    bio             text null,
    salt            text not null,
    hashed_password text not null,
    account_type    text null,
    profile_picture text null,

    constraint Account_pkey primary key (account_id),
    constraint Account_email_key unique (email)

  ) tablespace pg_default;

  create table
  public."BannedAccount" (
    banned_account_id     bigserial not null,
    banning_account_id    bigserial not null,
    ban_type              text null,
    start_time            timestamp without time zone null,
    end_time              timestamp without time zone null,
    constraint BannedAccount_pkey primary key (banned_account_id),
    constraint BannedAccount_banned_account_id_fkey foreign key (banned_account_id) references "Account" (account_id),
    constraint BannedAccount_banning_account_id_fkey foreign key (banning_account_id) references "Account" (account_id)
  ) tablespace pg_default;

  create table
  public."Book" (
    book_id               bigserial not null,
    title                 text null,
    author                text null,
    summary               text null,
    genre                 text null,
    owner_id              bigserial not null,
    content               text null,
    released_date         date null,
    book_rating           double precision null default 0,
    image                 text null,
    hidden                boolean not null default false,

    constraint Book_pkey primary key (book_id),
    constraint Book_owner_id_fkey foreign key (owner_id) references "Account" (account_id)
  
  ) tablespace pg_default;

  create table
  public."BookRating" (
    user_id bigserial not null,
    book_id bigserial not null,
    rating smallint null,
    date date null,

    constraint BookRating_pkey primary key (user_id, book_id),
    constraint BookRating_book_id_fkey foreign key (book_id) references "Book" (book_id),
    constraint BookRating_user_id_fkey foreign key (user_id) references "Account" (account_id)
  ) tablespace pg_default;

  create table
  public."Comment" (
    comment_id bigserial not null,
    book_id bigserial not null,
    comment_author_id bigserial not null,
    replied_comment_id bigserial not null,
    content text null,
    create_time timestamp with time zone null,
    
    constraint Comment_pkey primary key (comment_id),
    constraint Comment_book_id_fkey foreign key (book_id) references "Book" (book_id),
    constraint Comment_comment_author_id_fkey foreign key (comment_author_id) references "Account" (account_id),
    constraint Comment_replied_comment_id_fkey foreign key (replied_comment_id) references "Comment" (comment_id)
  ) tablespace pg_default;

  create table
  public."SampleAudioFile" (
    sample_audio_file_id bigserial not null,
    file_name text null,
    description text null,
    owner_id bigserial not null,
    upload_time timestamp without time zone null,
    content text null,
    file_extension text null,
    constraint SampleAudioFile_pkey primary key (sample_audio_file_id),
    constraint SampleAudioFile_owner_id_fkey foreign key (owner_id) references "Account" (account_id)
  ) tablespace pg_default;

  create table
  public."TextToSpeechGeneration" (
    id bigserial not null,
    account_id bigserial not null,
    generation_time timestamp without time zone null,
    text_content text not null,
    speech_content text not null,
    constraint TextToSpeechGeneration_pkey primary key (id),
    constraint TextToSpeechGeneration_account_id_fkey foreign key (account_id) references "Account" (account_id)
  ) tablespace pg_default;

  create table
  public."TrackedProgress" (
    user_id bigserial not null,
    book_id bigserial not null,
    page_number integer null,
    status text not null default '"not_started"'::text,
    most_recent_update_date timestamp with time zone null,
    constraint TrackedProgress_pkey primary key (user_id, book_id),
    constraint TrackedProgress_book_id_fkey foreign key (book_id) references "Book" (book_id),
    constraint TrackedProgress_user_id_fkey foreign key (user_id) references "Account" (account_id),
    constraint status_check check (
      (
        status = any (
          array[
            'in_progress'::text,
            'not_started'::text,
            'finished'::text
          ]
        )
      )
    )
  ) tablespace pg_default;