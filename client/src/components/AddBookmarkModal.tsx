import React, { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import styles from './AddBookmarkModal.module.css';
import formStyles from './AddBookmarkForm.module.css';
import { useToast } from './ToastContainer';
import { IBookmark } from '../types/bookmark';

interface AddBookmarkModalProps {
    onBookmarkAdded?: () => void;
    onBookmarkUpdated?: () => void;
    bookmarkToEdit?: IBookmark;
    onClose?: () => void;
}

const AddBookmarkModal: React.FC<AddBookmarkModalProps> = ({ 
    onBookmarkAdded, 
    onBookmarkUpdated,
    bookmarkToEdit,
    onClose 
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [url, setUrl] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [tags, setTags] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { showToast } = useToast();

    const isEditMode = !!bookmarkToEdit;

    useEffect(() => {
        if (bookmarkToEdit) {
            setUrl(bookmarkToEdit.url);
            setTitle(bookmarkToEdit.title);
            setDescription(bookmarkToEdit.description || '');
            setTags(bookmarkToEdit.tags?.join(', ') || '');
            setIsOpen(true);
        }
    }, [bookmarkToEdit]);

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        resetForm();
        if (onClose) {
            onClose();
        }
    };

    const resetForm = () => {
        setUrl('');
        setTitle('');
        setDescription('');
        setTags('');
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        if (!url.trim() || !title.trim()) {
            showToast('URL and Title are required.', 'error');
            setIsLoading(false);
            return;
        }

        const bookmarkData = {
            url: url.trim(),
            title: title.trim(),
            description: description.trim(),
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        };

        try {
            if (isEditMode && bookmarkToEdit) {
                await axios.put(`http://localhost:3000/api/v1/bookmark/${bookmarkToEdit._id}`, bookmarkData);
                showToast('Bookmark updated successfully!', 'success');
                if (onBookmarkUpdated) {
                    onBookmarkUpdated();
                }
            } else {
                await axios.post('http://localhost:3000/api/v1/bookmark', bookmarkData);
                showToast('Bookmark added successfully!', 'success');
                if (onBookmarkAdded) {
                    onBookmarkAdded();
                }
            }

            resetForm();
            closeModal();
        } catch (err: any) {
            showToast(err.response?.data?.msg || err.message || 'An unknown error occurred. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {!isEditMode && (
                <button
                    className={styles.addButton}
                    onClick={openModal}
                    aria-label="Add new bookmark"
                >
                    +
                </button>
            )}

            {isOpen && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button
                            className={styles.closeButton}
                            onClick={closeModal}
                            aria-label="Close modal"
                        >
                            ×
                        </button>

                        <form onSubmit={handleSubmit} className={styles.formContainer}>
                            <h2 className={styles.formTitle}>
                                {isEditMode ? 'Edit Bookmark' : 'Add New Bookmark'}
                            </h2>

                            <div className={formStyles.formGroup}>
                                <label htmlFor="url" className={formStyles.label}>URL:</label>
                                <input
                                    type="url"
                                    id="url"
                                    className={formStyles.input}
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className={formStyles.formGroup}>
                                <label htmlFor="title" className={formStyles.label}>Title:</label>
                                <input
                                    type="text"
                                    id="title"
                                    className={formStyles.input}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className={formStyles.formGroup}>
                                <label htmlFor="description" className={formStyles.label}>Description (optional):</label>
                                <textarea
                                    id="description"
                                    className={formStyles.textarea}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className={formStyles.formGroup}>
                                <label htmlFor="tags" className={formStyles.label}>Tags (comma-separated, optional):</label>
                                <input
                                    type="text"
                                    id="tags"
                                    className={formStyles.input}
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    placeholder="e.g. tech, news, reference"
                                    disabled={isLoading}
                                />
                            </div>

                            <button type="submit" className={formStyles.submitButton} disabled={isLoading}>
                                {isLoading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Bookmark' : 'Add Bookmark')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddBookmarkModal;