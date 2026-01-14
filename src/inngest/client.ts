import { Inngest } from "inngest";
import {sentryMiddleware} from "@inngest"
// Create a client to send and receive events
export const inngest = new Inngest({ id: "enigma" });

