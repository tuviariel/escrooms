import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { roomsService } from "../../../services/service";
import { RoomType } from "../../Dashboard/Dashboard";

type RoomViewerProps = {
    roomId: string;
};

/**
 * RoomViewer component for viewing an escape room in RoomBuilder
 * For now - Just redirects to the Room page to view the room
 */
export const RoomViewer = ({ roomId }: RoomViewerProps) => {
    const navigate = useNavigate();
    const [roomData, setRoomData] = useState<RoomType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRoom = async () => {
            if (!roomId) return;
            try {
                const rooms = await roomsService.getRoomById(roomId);
                if (rooms && rooms[0]) {
                    setRoomData(rooms[0]);
                    // Navigate to the room page to view it
                    navigate(`/room/${roomId}?fromBuilder`);
                }
            } catch (error) {
                console.error("Error loading room:", error);
            } finally {
                setLoading(false);
            }
        };
        loadRoom();
    }, [roomId, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white">
                Loading room...
            </div>
        );
    }

    if (!roomData) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white">
                Room not found
            </div>
        );
    }

    // The navigation will handle the display, but we show a message here
    return (
        <div className="flex items-center justify-center min-h-screen text-white">
            Redirecting to room view...
        </div>
    );
};
