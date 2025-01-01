import LOGO                                             from "./assets/images/logo.png";
import ADD_ICON                                         from "./assets/images/add-icon.png";
import USER_ICON                                        from "./assets/images/user-icon.png";
import LOCK_ICON                                        from "./assets/images/lock-icon.png";
import MAIL_ICON                                        from "./assets/images/mail-icon.png";
import LEFT_ICON                                        from "./assets/images/left-icon.png";
import RIGHT_ICON                                       from "./assets/images/right-icon.png";
import GOOGLE_ICON                                      from "./assets/images/google-icon.png";
import EYE_ON_ICON                                      from "./assets/images/eye-on-icon.png";
import SEARCH_ICON                                      from "./assets/images/search-icon.png";
import SLIDERS_ICON                                     from "./assets/images/sliders-icon.png";
import EYE_OFF_ICON                                     from "./assets/images/eye-off-icon.png";
import CALENDAR_ICON                                    from "./assets/images/calendar-icon.png";
import EYE_OPEN_ICON                                    from "./assets/images/eye-open-icon.png";
import RED_TRASH_ICON                                   from "./assets/images/red-trash-icon.png";
import LEFT_ARROW_ICON                                  from "./assets/images/left-arrow-icon.png";
import EMPTY_STAR_ICON                                  from "./assets/images/empty-star-icon.png";
import EYE_CLOSED_ICON                                  from "./assets/images/eye-closed-icon.png";
import FILLED_STAR_ICON                                 from "./assets/images/filled-star-icon.png";
import WHITE_TRASH_ICON                                 from "./assets/images/white-trash-icon.png";
import PLAY_BUTTON_ICON                                 from "./assets/images/play-button-icon.png";
import BLACK_PENCIL_ICON                                from "./assets/images/black-pencil-icon.png";
import WHITE_PENCIL_ICON                                from "./assets/images/white-pencil-icon.png";
import PAUSE_BUTTON_ICON                                from "./assets/images/pause-button-icon.png";
import DEFAULT_BOOK_COVER                               from "./assets/images/default-book-cover.png";
import DEFAULT_PROFILE_PICTURE                          from "./assets/images/default-profile-picture.png";
import HOVERED_PLAY_BUTTON_ICON                         from "./assets/images/hovered-play-button-icon.png";
import HOVERED_PAUSE_BUTTON_ICON                        from "./assets/images/hovered-pause-button-icon.png";
import LANDING_PAGE_BOTTOM_LEFT_CORNER                  from "./assets/images/landing-page-bottom-left-corner.png";
import LANDING_PAGE_BOTTOM_RIGHT_CORNER                 from "./assets/images/landing-page-bottom-right-corner.png";
import LANDING_PAGE_LOGIN_SECTION_TOP_RIGHT_CORNER      from "./assets/images/landing-page-login-section-top-right-corner.png";
import LANDING_PAGE_LOGIN_SECTION_BOTTOM_LEFT_CORNER    from "./assets/images/landing-page-login-section-bottom-left-corner.png";
import AUDIO_PLAY_ICON                                  from "./assets/images/audio-play-icon.png";
import AUDIO_PAUSE_ICON                                 from "./assets/images/audio-pause-icon.png";
import AUDIO_NEXT_ICON                                  from "./assets/images/audio-next-icon.png";
import AUDIO_PREVIOUS_ICON                              from "./assets/images/audio-previous-icon.png";
import HOVERED_AUDIO_PLAY_ICON                          from "./assets/images/hovered-audio-play-icon.png";
import HOVERED_AUDIO_PAUSE_ICON                         from "./assets/images/hovered-audio-pause-icon.png";
import HOVERED_AUDIO_NEXT_ICON                          from "./assets/images/hovered-audio-next-icon.png";
import HOVERED_AUDIO_PREVIOUS_ICON                      from "./assets/images/hovered-audio-previous-icon.png";
import DISABLED_LEFT_ICON                               from "./assets/images/disabled-left-icon.png";
import DISABLED_RIGHT_ICON                              from "./assets/images/disabled-right-icon.png";

const IMAGES = {
    LOGO,
    ADD_ICON,
    USER_ICON,
    LOCK_ICON,
    MAIL_ICON,
    LEFT_ICON,
    RIGHT_ICON,
    GOOGLE_ICON,
    EYE_ON_ICON,
    SEARCH_ICON,
    SLIDERS_ICON,
    EYE_OFF_ICON,
    EYE_OPEN_ICON,
    CALENDAR_ICON,
    RED_TRASH_ICON,
    EYE_CLOSED_ICON,
    EMPTY_STAR_ICON,
    LEFT_ARROW_ICON,
    PLAY_BUTTON_ICON,
    FILLED_STAR_ICON,
    WHITE_TRASH_ICON,
    PAUSE_BUTTON_ICON,
    BLACK_PENCIL_ICON,
    WHITE_PENCIL_ICON,
    DEFAULT_BOOK_COVER,
    DEFAULT_PROFILE_PICTURE,
    HOVERED_PLAY_BUTTON_ICON,
    HOVERED_PAUSE_BUTTON_ICON,
    LANDING_PAGE_BOTTOM_LEFT_CORNER,
    LANDING_PAGE_BOTTOM_RIGHT_CORNER,
    LANDING_PAGE_LOGIN_SECTION_TOP_RIGHT_CORNER,
    LANDING_PAGE_LOGIN_SECTION_BOTTOM_LEFT_CORNER,
    AUDIO_PLAY_ICON,
    AUDIO_PAUSE_ICON,
    AUDIO_NEXT_ICON,
    AUDIO_PREVIOUS_ICON,
    HOVERED_AUDIO_PLAY_ICON,
    HOVERED_AUDIO_PAUSE_ICON,
    HOVERED_AUDIO_NEXT_ICON,
    HOVERED_AUDIO_PREVIOUS_ICON,
    DISABLED_LEFT_ICON,
    DISABLED_RIGHT_ICON,

    decodeBookCoverImage: (bookCover: string | null) => {
        if (!bookCover) 
            return DEFAULT_BOOK_COVER;

        const imageExtensions = ["jpeg", "jpg", "png", "gif", "bmp", "webp"];

        for (const extension of imageExtensions) 
            if (bookCover.includes(`data:image/${extension}`)) 
                return bookCover;

        return `data:image/jpeg;base64,${bookCover}`;
    },

    decodeProfilePicture: (profilePicture: string | null) => {
        if (!profilePicture) 
            return DEFAULT_PROFILE_PICTURE;

        const imageExtensions = ["jpeg", "jpg", "png", "gif", "bmp", "webp"];

        for (const extension of imageExtensions) 
            if (profilePicture.includes(`data:image/${extension}`)) 
                return profilePicture;

        return `data:image/jpeg;base64,${profilePicture}`;
    },

    convertImageFileToBase64 : (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string);   // Resolve with the base64 string
            };
            reader.onerror = reject;                // Reject the promise if there's an error
            reader.readAsDataURL(file);             // Read the image file as a base64 string
        });
    }
};

export default IMAGES;