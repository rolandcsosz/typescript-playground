// logger.ts
type LogType = "info" | "warning" | "error" | "reset";

type LogEntry = {
    type: LogType;
    message: string;
};

type Subscriber = (entry: LogEntry) => void;

class Logger {
    private subscribers: Subscriber[] = [];

    subscribe(fn: Subscriber) {
        this.subscribers.push(fn);
        return () => {
            this.subscribers = this.subscribers.filter((s) => s !== fn);
        };
    }

    private emit(type: LogType, message: string) {
        const entry = { type, message };
        this.subscribers.forEach((fn) => fn(entry));
    }

    info = (...messages: unknown[]) => {
        const formatted = messages.map((msg) => JSON.stringify(msg, null, 2)).join(" ");
        this.emit("info", formatted);
    };

    warning = (...messages: unknown[]) => {
        const formatted = messages.map((msg) => JSON.stringify(msg, null, 2)).join(" ");
        this.emit("warning", formatted);
    };

    error = (...messages: unknown[]) => {
        const formatted = messages.map((msg) => JSON.stringify(msg, null, 2)).join(" ");
        this.emit("error", formatted);
    };

    reset = () => {
        this.emit("reset", "");
    };
}

export const logger = new Logger();
