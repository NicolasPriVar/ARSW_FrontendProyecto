import React, { useEffect, useRef, useState } from "react";

const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

function LlamadaVoz({ codigo, nombre }) {
    const [conectado, setConectado] = useState(false);
    const peersRef = useRef({});
    const ws = useRef(null);
    const localStream = useRef(null);
    const remoteAudios = useRef({});

    useEffect(() => {
        ws.current = new WebSocket(`ws://localhost:8080/ws/llamada/${codigo}`);

        ws.current.onmessage = async (message) => {
            const data = JSON.parse(message.data);
            const { from, to, type, sdp, candidate } = data;

            if (from === nombre) return;

            if (type === "join") {
                if (!peersRef.current[from] && nombre.localeCompare(from) > 0) {
                    await createOffer(from);
                }
            }

            if (type === "offer") {
                if (!peersRef.current[from]) {
                    await createAnswer(from, sdp);
                }
            }

            if (type === "answer") {
                const pc = peersRef.current[from];
                if (pc && !pc.currentRemoteDescription) {
                    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                }
            }

            if (type === "candidate") {
                const pc = peersRef.current[from];
                if (pc) {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                }
            }
        };

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                localStream.current = stream;
                setConectado(true);
                ws.current.send(JSON.stringify({ from: nombre, type: "join" }));
            })
            .catch((err) => {
                console.error("Error al acceder al micrófono:", err);
                alert("No se pudo acceder al micrófono. Verifica que esté conectado, encendido y permitido por el navegador.");
            });


        return () => {
            Object.values(peersRef.current).forEach((pc) => pc.close());
            Object.values(remoteAudios.current).forEach((audio) => audio.remove());
            if (ws.current) ws.current.close();
            if (localStream.current) {
                localStream.current.getTracks().forEach((t) => t.stop());
            }
        };
    }, []);

    const createPeerConnection = (otherUser) => {
        const pc = new RTCPeerConnection(servers);

        localStream.current.getTracks().forEach((track) => {
            pc.addTrack(track, localStream.current);
        });

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                ws.current.send(
                    JSON.stringify({
                        from: nombre,
                        to: otherUser,
                        type: "candidate",
                        candidate: event.candidate,
                    })
                );
            }
        };

        pc.ontrack = (event) => {
            if (!remoteAudios.current[otherUser]) {
                const audio = document.createElement("audio");
                audio.srcObject = event.streams[0];
                audio.autoplay = true;
                document.body.appendChild(audio);
                remoteAudios.current[otherUser] = audio;
            }
        };

        peersRef.current[otherUser] = pc;
        return pc;
    };

    const createOffer = async (to) => {
        const pc = createPeerConnection(to);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        ws.current.send(
            JSON.stringify({
                from: nombre,
                to,
                type: "offer",
                sdp: offer,
            })
        );
    };

    const createAnswer = async (from, offer) => {
        const pc = createPeerConnection(from);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        ws.current.send(
            JSON.stringify({
                from: nombre,
                to: from,
                type: "answer",
                sdp: answer,
            })
        );
    };

    return (
        <div>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>
                {conectado ? "🎙️ En llamada" : "Conectando..."}
            </p>
        </div>
    );
}

export default LlamadaVoz;
