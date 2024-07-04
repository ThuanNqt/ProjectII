// fix error multiple connect when reload page
let socket = io({ transports: ["websocket"], upgrade: false });
