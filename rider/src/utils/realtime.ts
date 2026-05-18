import axios from "axios";
import { env } from "../config/dotenv.config.js";

type EmitEventParams<T> = {
  event: string;
  room: string;
  payload: T;
};

export const emitRealtimeEvent = async <T>({
  event,
  room,
  payload,
}: EmitEventParams<T>) => {
  await axios.post(
    `${env.REALTIME_SERVICE}/api/v1/internal/emit`,
    {
      event,
      room,
      payload,
    },
    {
      headers: {
        "x-internal-key": env.INTERNAL_SERVICE_KEY,
      },
    },
  );
};
