import React from 'react';
import { IBookmark } from '../types/bookmark';
import styles from './BookmarkItem.module.css';

// Helper functions for URL validation and processing
const urlHelpers = {
    isValid: (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    },

    getDomain: (url: string): string => {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch (e) {
            return '';
        }
    },

    getFaviconUrl: (domain: string): string => {
        return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32` : '';
    },

    formatDate: (dateString?: string): string | null => {
        return dateString
            ? new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
            : null;
    }
};

interface BookmarkItemProps {
    bookmark: IBookmark;
    onDelete?: (id: string) => void;
    onEdit?: (bookmark: IBookmark) => void;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark, onDelete, onEdit }) => {
    const handleDeleteClick = () => {
        if (onDelete && window.confirm(`Are you sure you want to delete "${bookmark.title}"?`)) {
            onDelete(bookmark._id);
        }
    };

    const handleEditClick = () => {
        if (onEdit) {
            onEdit(bookmark);
        }
    };

    // Process URL and date information using helper functions
    const isUrlValid = urlHelpers.isValid(bookmark.url);
    const domain = isUrlValid ? urlHelpers.getDomain(bookmark.url) : '';
    const faviconUrl = urlHelpers.getFaviconUrl(domain);
    const formattedDate = urlHelpers.formatDate(bookmark.createdAt);

    return (
        <li className={styles.listItem}>
            <div className={styles.cardContent}>
                {/* Favicon and title section */}
                <div className={styles.headerSection}>
                    <div className={styles.faviconContainer}>
                        {isUrlValid && faviconUrl ? (
                            <img
                                src={faviconUrl}
                                alt=""
                                className={styles.favicon}
                            />
                        ) : (
                            <span className={styles.invalidUrlIcon}>❌</span>
                        )}
                    </div>
                    <div className={styles.titleContainer}>
                        <h3 className={styles.title}>
                            {isUrlValid ? (
                                <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                                    {bookmark.title}
                                </a>
                            ) : (
                                <span className={`${styles.link} ${styles.invalidLink}`}>
                                    {bookmark.title} <span className={styles.invalidUrlLabel}>(Invalid URL)</span>
                                </span>
                            )}
                        </h3>
                        <p className={styles.urlParagraph}>
                            {isUrlValid ? (
                                <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className={styles.urlLink}>
                                    {domain}
                                </a>
                            ) : (
                                <span className={`${styles.urlLink} ${styles.invalidUrlText}`}>
                                    {bookmark.url}
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                {/* Description section */}
                {bookmark.description && (
                    <div className={styles.descriptionSection}>
                        <p className={styles.description}>{bookmark.description}</p>
                    </div>
                )}

                {/* Footer with tags and date */}
                <div className={styles.cardFooter}>
                    {bookmark.tags && bookmark.tags.length > 0 && (
                        <div className={styles.tags}>
                            {bookmark.tags.map((tag, index) => (
                                <span key={index} className={styles.tag}>{tag}</span>
                            ))}
                        </div>
                    )}
                    {formattedDate && (
                        <div className={styles.dateInfo}>
                            <span className={styles.date}>{formattedDate}</span>
                        </div>
                    )}
                </div>
            </div>

            {(onEdit || onDelete) && (
                <div className={styles.actionsSection}>
                    {onEdit && (
                        <button onClick={handleEditClick} className={styles.button}>
                            <span className={styles.buttonIcon}>✏️</span>
                            <span>Edit</span>
                        </button>
                    )}
                    {onDelete && (
                        <button onClick={handleDeleteClick} className={`${styles.button} ${styles.deleteButton}`}>
                            <span className={styles.buttonIcon}>🗑️</span>
                            <span>Delete</span>
                        </button>
                    )}
                </div>
            )}
        </li>
    );
};


export default BookmarkItem;