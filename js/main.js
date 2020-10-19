var randomizedIDHack = `kord_${Math.floor(Math.random() * Math.floor(99999999)).toString()}`
            var peer = new Peer(randomizedIDHack);
            var whoAmITalkingTo = null;
            var conn = null; //note that you probably have to specify null for all blank variables but idk
            var videoCall = false
            var allowCalls = false
            

            function disco() {
                peer.disconnect();
            }

            function allowCallsToggle() {
                if (allowCalls == false) {
                    allowCalls = true
                } else {
                    allowCalls = false
                }
                document.getElementById('allowCalls').innerText = String(allowCalls)
            }


            function getAllowCalls() {
                return allowCalls;
            }

            function setVideoCall(bool) {
                videoCall = bool
            } 

            function allowVideoToggle() {
                if (videoCall == false) {
                    setVideoCall(true)
                } else {
                    setVideoCall(false)
                }
                document.getElementById('allowVideo').innerText = String(videoCall)
            }
            function openConnection() {
                peer.disconnect();
                var destId = prompt("Peer ID to connect with:")
                console.log(`Opening connection to ${destId}`)
                conn = peer.connect(destId, {
                    reliable: true
                });
                whoAmITalkingTo = destId
            }

            peer.on('open', function(id) {
                console.log(`Connection to server (not user) opened! My peer ID is: ${id}`);
            });

            peer.on('connection', function() {
                console.log("Someone attempted to connect to us!")
            });

            peer.on('disconnected', function() { 
                console.log("Connection closed OK.");
             });

            function sendText(text) {
                var safeText = filterXSS(text.toString());
                var finalText = `<p>[${randomizedIDHack}]: ${safeText.toString()}</p>`;
                conn.send(finalText);
                document.getElementById("chatLogs").innerHTML += finalText
            }

            peer.on('connection', function(conn) {
                conn.on('data', function(data){
                    // Will print the text.
                    document.getElementById("chatLogs").innerHTML += data.toString()
                });
            });

            function call(gac, oid) {
                var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                getUserMedia({video: allowVideoToggle, audio: gac}, function(stream) {
                    var call = peer.call(oid, stream);
                    call.on('stream', function(remoteStream) {
                // Show stream in some video/canvas element.
                });
            }, function(err) {
                console.log('Failed to get local stream' ,err);
            });
            }

            function answer() { 
                var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                peer.on('call', function(call) {
                    getUserMedia({video: true, audio: true}, function(stream) {
                        call.answer(stream); // Answer the call with an A/V stream.
                        call.on('stream', function(remoteStream) {
                        // Show stream in some video/canvas element.
                });
                    }, function(err) {
                        console.log('Failed to get local stream' ,err);
                    });
                });
            }

            setTimeout("document.getElementById('yourId').innerHTML = peer.id", 3000)