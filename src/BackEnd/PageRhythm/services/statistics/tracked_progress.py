class TrackedProgress:
    def __init__(self, user_id, book_id, page_number, status, most_recent_update_date):
        self.user_id = user_id
        self.book_id = book_id
        self.page_number = page_number
        self.status = status
        self.most_recent_update_date = most_recent_update_date

    def get_user_id(self):
        return self.user_id

    def get_book_id(self):
        return self.book_id

    def get_page_number(self):
        return self.page_number

    def get_status(self):
        return self.status

    def get_most_recent_update_date(self):
        return self.most_recent_update_date

    def set_user_id(self, user_id):
        self.user_id = user_id

    def set_book_id(self, book_id):
        self.book_id = book_id

    def set_page_number(self, page_number):
        self.page_number = page_number

    def set_status(self, status):
        self.status = status

    def set_most_recent_update_date(self, date):
        self.most_recent_update_date = date

    def to_serializable_JSON(self):
        return {
            "user_id": self.user_id,
            "book_id": self.book_id,
            "page_number": self.page_number,
            "status": self.status,
            "most_recent_update_date": self.most_recent_update_date.isoformat(),
        }
