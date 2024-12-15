import LOGO from "./assets/images/logo.png";
import ADD_ICON from "./assets/images/add-icon.png";
import USER_ICON from "./assets/images/user-icon.png";
import LOCK_ICON from "./assets/images/lock-icon.png";
import MAIL_ICON from "./assets/images/mail-icon.png";
import LEFT_ICON from "./assets/images/left-icon.png";
import RIGHT_ICON from "./assets/images/right-icon.png";
import GOOGLE_ICON from "./assets/images/google-icon.png";
import EYE_ON_ICON from "./assets/images/eye-on-icon.png";
import SEARCH_ICON from "./assets/images/search-icon.png";
import SLIDERS_ICON from "./assets/images/sliders-icon.png";
import EYE_OFF_ICON from "./assets/images/eye-off-icon.png";
import CALENDAR_ICON from "./assets/images/calendar-icon.png";
import RED_TRASH_ICON from "./assets/images/red-trash-icon.png";
import LEFT_ARROW_ICON from "./assets/images/left-arrow-icon.png";
import EMPTY_STAR_ICON from "./assets/images/empty-star-icon.png";
import FILLED_STAR_ICON from "./assets/images/filled-star-icon.png";
import WHITE_TRASH_ICON from "./assets/images/white-trash-icon.png";
import BLACK_PENCIL_ICON from "./assets/images/black-pencil-icon.png";
import WHITE_PENCIL_ICON from "./assets/images/white-pencil-icon.png";
import DEFAULT_BOOK_COVER from "./assets/images/default-book-cover.png";
import DEFAULT_PROFILE_PICTURE from "./assets/images/default-profile-picture.png";
import LANDING_PAGE_BOTTOM_LEFT_CORNER from "./assets/images/landing-page-bottom-left-corner.png";
import LANDING_PAGE_BOTTOM_RIGHT_CORNER from "./assets/images/landing-page-bottom-right-corner.png";
import LANDING_PAGE_LOGIN_SECTION_TOP_RIGHT_CORNER from "./assets/images/landing-page-login-section-top-right-corner.png";
import LANDING_PAGE_LOGIN_SECTION_BOTTOM_LEFT_CORNER from "./assets/images/landing-page-login-section-bottom-left-corner.png";

const IMAGES = {
    LOGO,
    LANDING_PAGE_BOTTOM_LEFT_CORNER,
    LANDING_PAGE_BOTTOM_RIGHT_CORNER,
    LANDING_PAGE_LOGIN_SECTION_BOTTOM_LEFT_CORNER,
    LANDING_PAGE_LOGIN_SECTION_TOP_RIGHT_CORNER,
    USER_ICON,
    LOCK_ICON,
    GOOGLE_ICON,
    EYE_ON_ICON,
    EYE_OFF_ICON,
    MAIL_ICON,
    BLACK_PENCIL_ICON,
    CALENDAR_ICON,
    DEFAULT_PROFILE_PICTURE,
    DEFAULT_BOOK_COVER,
    SEARCH_ICON,
    SLIDERS_ICON,
    LEFT_ARROW_ICON,
    FILLED_STAR_ICON,
    EMPTY_STAR_ICON,
    LEFT_ICON,
    RIGHT_ICON,
    ADD_ICON,
    WHITE_TRASH_ICON,
    RED_TRASH_ICON,
    WHITE_PENCIL_ICON,

    decodeBookCoverImage: (bookCover: string | null) => {
        if (!bookCover) {
            return DEFAULT_BOOK_COVER;
        }
        return `data:image/jpeg;base64,${bookCover}`;
    }
};

export default IMAGES;