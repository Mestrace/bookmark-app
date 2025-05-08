import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import styles from './AddBookmarkForm.module.css';
import { useToast } from './ToastContainer';

interface AddBookmarkFormProps {
    onBookmarkAdded?: () => void;
}

const AddBookmarkForm: React.FC<AddBookmarkFormProps> = ({ onBookmarkAdded }) => {
    const [url, setUrl] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [tags, setTags] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { showToast } = useToast();
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
            const response = await axios.post('http://localhost:3000/api/v1/bookmark', bookmarkData);

            setUrl('');
            setTitle('');
            setDescription('');
            setTags('');

            showToast('Bookmark added successfully!', 'success');

            if (onBookmarkAdded) {
                onBookmarkAdded();
            }
        } catch (err: any) {
            console.error('Failed to add bookmark:', err);
            showToast(err.response?.data?.msg || err.message || 'An unknown error occurred. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <h2 className={styles.formTitle}>Add New Bookmark</h2>

            {/* Error messages are now shown as toast notifications */}

            <div className={styles.formGroup}>
                <label htmlFor="url" className={styles.label}>URL:</label>
                <input
                    type="url" // Use appropriate type for better browser validation/keyboard
                    id="url"
                    className={styles.input}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required // Add basic HTML5 required validation
                    disabled={isLoading} // Disable input while loading
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.label}>Title:</label>
                <input
                    type="text"
                    id="title"
                    className={styles.input}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>Description (optional):</label>
                <textarea
                    id="description"
                    className={styles.textarea}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isLoading}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="tags" className={styles.label}>Tags (comma-separated, optional):</label>
                <input
                    type="text"
                    id="tags"
                    className={styles.input}
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. tech, news, reference"
                    disabled={isLoading}
                />
            </div>

            <button type="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Bookmark'}
            </button>
        </form>
    );
};

export default AddBookmarkForm;