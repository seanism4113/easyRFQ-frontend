/**
 * ResponseMessage Component
 *
 * This component is responsible for displaying success or error messages
 * to the user. It conditionally renders a message only if one is provided.
 *
 * Props:
 * @param {string} messageType - Determines the styling of the message (either "error" or "success").
 * @param {string} message - The message text to be displayed.
 */

const ResponseMessage = ({ messageType, message }) => {
	// If there is no message, do not render anything (prevents empty divs in the UI)
	if (!message) return null;

	// Determine the appropriate CSS class based on the message type
	const className = messageType === "error" ? "error-message" : "success-message";

	return <div className={className}>{message}</div>;
};

export default ResponseMessage;
