// ... existing code ...
const ClassList = ({ onEdit, onAdd, onViewDetails, notification }) => {
    // ... existing code ...

    useEffect(() => {
        fetchClasses();

        // Handle notification from props
        if (notification) {
            showNotification(notification.message, notification.type);
        }
    }, [notification]);

    // ... existing code ...
};
// ... existing code ...