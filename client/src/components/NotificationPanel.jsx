import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import api from "../services/api";
import { format } from "date-fns";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get("/capa/notifications");
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // 1 min poll
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-100 z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-slate-50 font-semibold text-slate-700">
            Notifications
          </div>
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-sm">
              No new notifications
            </div>
          ) : (
            <div>
              {notifications.map((notif) => (
                <div
                  key={notif._id}
                  className="p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                        notif.type === "Overdue"
                          ? "bg-red-100 text-red-700"
                          : notif.type === "Escalation"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {notif.type}
                    </span>
                    <span className="text-xs text-slate-400">
                      {format(new Date(notif.timestamp), "MMM dd, HH:mm")}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">{notif.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
