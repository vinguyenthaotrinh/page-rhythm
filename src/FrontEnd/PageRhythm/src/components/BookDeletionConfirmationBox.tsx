import "../styles/book-deletion-confirmation-box-styles.css";

interface BookDeletionConfirmationBoxProps {
    title?:                     string;            
    message?:                   string;        
    showDeletionConfirmation:   boolean;        
    onConfirm:                  () => void;    
    onCancel:                   () => void;    
}

const BookDeletionConfirmationBox: React.FC<BookDeletionConfirmationBoxProps> = ({
    title                       =   "Delete your book",
    message                     =   "Are you sure you want to delete this book?",
    showDeletionConfirmation,
    onConfirm,
    onCancel,
}) => {

    if (!showDeletionConfirmation)
        return null;

    return (
        <div 
            className   =   "books-my-library-page-deletion-confirmation-overlay"
        >
            <div 
                className   =   "books-my-library-page-deletion-confirmation-box"
            >
                <h1 
                    className   =   "books-my-library-page-deletion-confirmation-title"
                >
                    {title}
                </h1>
                <p>
                    {message}
                </p>
                <div 
                    className   =   "books-my-library-page-deletion-confirmation-buttons"
                >
                    <button
                        className   =   "books-my-library-page-deletion-confirmation-button confirm"
                        onClick     =   {onConfirm}
                    >
                        Yes
                    </button>
                    <button
                        className   =   "books-my-library-page-deletion-confirmation-button cancel"
                        onClick     =   {onCancel}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookDeletionConfirmationBox;