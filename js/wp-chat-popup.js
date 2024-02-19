jQuery(document).ready(function($) {
    // Create chat popup
    var chatPopup = '<div id="chat-popup"><div id="chat-header"><div id="chat-title">Chat</div><button id="clear-storage-btn" title="Clear Local Storage"></button><div id="minimize-icon">-</div></div>';
    chatPopup += '<div id="chat-messages"></div><div id="loader" ></div><form id="chat-form">';
    chatPopup += '<input type="text" id="message" name="message" placeholder="Type your message">';
    chatPopup += '<span class="response"></span>';
    chatPopup += '</div>';

    // Append chat popup to body
    $('body').append(chatPopup);

});

jQuery(document).ready(function($) {
    // Open the chat popup
    function openChatPopup() {
        $('#chat-popup').fadeIn();
    }

    // Close the chat popup
    function closeChatPopup() {
        $('#chat-popup').fadeOut();
    }

    // Event listener for the close button
    $('#chat-popup .close').click(closeChatPopup);

    // Event listener for the form submission
    $('#chat-form').submit(function(event) {
            event.preventDefault(); // Prevent default form submission
            var message = $('#message').val(); // Serialize form data
            var message = $("#message").val().trim();
            if (message === "") {
                return; // Don't send empty messages
            }
            appendMessageYou("You: " + message);
            $("#message").val(""); 
            addMessage('You', message);
            // Send AJAX request
            setTimeout(function() {
                $('#loader').show();
            }, 1500);
            $.ajax({
                url: ajax_object.ajaxurl, // AJAX URL defined by wp_localize_script
                type: 'POST',
                data: {
                    action: 'process_chat_message', // AJAX action
                    chat_ai_assistant_nonce: ajax_object.nonce,
                    message: message // Form data
                },
                success: function(response) {
                    $('#loader').hide();
                    appendMessageAI(response);
                    addMessage('AI', response);
                    //console.log('AJAX request successful:', response);
                    // Handle success response here
                },
                error: function(xhr, status, error) {
                    console.error('AJAX request error:', error);
                    // Handle error here
                }
            });
        });
    

    // Call openChatPopup() to open the popup
    openChatPopup();
    setTimeout(function() {
        //appendMessage("Website: This is a reply message from the AI.");
    }, 5000); // Simulate a delay for the reply message

    function appendMessageYou(message) {
        $("#chat-messages").append("<div class='your-message'>" + message + "</div>");
        // Automatically scroll to the bottom to show new message
        $("#chat-messages").scrollTop($("#chat-messages")[0].scrollHeight);
    }
    function appendMessageAI(message) {
        $("#chat-messages").append("<div class='ai-message'>" + message + "</div>");
        // Automatically scroll to the bottom to show new message
        $("#chat-messages").scrollTop($("#chat-messages")[0].scrollHeight);
    }
    $('#minimize-icon').click(function() {
        $('#chat-header').toggleClass('minimized-header');
        $('#chat-messages, #chat-form').toggleClass('hidden');
        var $minimizeIcon = $('#minimize-icon');
        if ($minimizeIcon.text() === '-') {
            $minimizeIcon.text('+');
        } else {
            $minimizeIcon.text('-');
        }
        
    });
    function addMessage(sender, message) {
               // Store the message in local storage
        var messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
        messages.push({ sender: sender, message: message });
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
    function appendMessage(sender, message) {
        // Add the message to the chat window
        var messageDiv = $('<div >').text(sender + ': ' + message);
        if (sender === 'You') {
            var messageDiv = $('<div class="your-message">').text(sender + ': ' + message);
            $('#chat-messages').append(messageDiv);
        } else if (sender === 'AI') {
            var messageDiv = $('<div class="ai-message">').text(message);
            $('#chat-messages').append(messageDiv);
        }
        
    }

    // Function to populate chat window with stored messages
    function populateChatWindow() {
        var messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
        
        messages.forEach(function(msg) {
            console.log(msg);
            appendMessage(msg.sender, msg.message);
        });
    }

    // Populate chat window with stored messages on page load
    // Check if local storage already contains chat messages
    window.onload = function() {
            // Populate chat window with stored messages if available
            populateChatWindow();
    };
    $('#clear-storage-btn').click(function() {
        localStorage.removeItem('chatMessages');
        $('#chat-messages').html('');
        // Optionally, update the chat window to clear displayed messages
        $('#chat-messages .your-message, #chat-messages .ai-message').empty();
    });
    
});

