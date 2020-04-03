$('#create-room-form').submit(event => {
    event.preventDefault();
    const url = $('#create-room-input').val();
    const roomId = Math.random().toString(36).substr(2);
    Cookies.set(roomId + '-video', url);
    Cookies.set('play', true);
    window.location.href += `rooms/${roomId}`;
});
