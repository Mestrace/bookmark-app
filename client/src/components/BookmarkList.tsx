import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { IBookmark } from '../types/bookmark';
import BookmarkItem from './BookmarkItem';
import AddBookmarkModal from './AddBookmarkModal';
import styles from './BookmarkList.module.css';
import { useToast } from './ToastContainer';

const BookmarkList: React.FC = () => {
    const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [bookmarkToEdit, setBookmarkToEdit] = useState<IBookmark | undefined>(undefined);
    const { showToast } = useToast();

    const fetchBookmarks = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await axios.get<IBookmark[]>('http://localhost:3000/api/v1/bookmark');
            setBookmarks(response.data);
        } catch (err: any) {
            console.error("Error fetching bookmarks:", err);
            showToast(err.response?.data?.msg || err.message || 'Failed to fetch bookmarks.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchBookmarks();
    }, [fetchBookmarks]);

    if (isLoading) {
        return <div className={styles.loadingMessage}>Loading bookmarks...</div>;
    }

    const handleDeleteBookmark = async (id: string) => {
        try {
            await axios.delete(`http://localhost:3000/api/v1/bookmark/${id}`);
            setBookmarks(prevBookmarks => prevBookmarks.filter(bookmark => bookmark._id !== id));
            showToast('Bookmark deleted successfully!', 'success');
        } catch (err: any) {
            showToast(err.response?.data?.msg || err.message || 'Failed to delete bookmark.', 'error');
        }
    };

    const handleEditBookmark = (bookmark: IBookmark) => {
        setBookmarkToEdit(bookmark);
    };

    const handleEditClose = () => {
        setBookmarkToEdit(undefined);
    };

    return (
        <div>
            <h2 className={styles.title}>Bookmarks</h2>
            {bookmarks.length === 0 ? (
                <p className={styles.emptyMessage}>No bookmarks have been added yet.</p>
            ) : (
                <ul className={styles.bookmarksList}>
                    {bookmarks.map((bookmark) => (
                        <BookmarkItem
                            key={bookmark._id}
                            bookmark={bookmark}
                            onDelete={handleDeleteBookmark}
                            onEdit={handleEditBookmark}
                        />
                    ))}
                </ul>
            )}
            <AddBookmarkModal
                onBookmarkAdded={fetchBookmarks}
                onBookmarkUpdated={fetchBookmarks}
                bookmarkToEdit={bookmarkToEdit}
                onClose={handleEditClose}
            />
        </div>
    );
};

export default BookmarkList;