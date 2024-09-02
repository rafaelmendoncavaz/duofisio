import type { z } from "zod";
import type { loginSchema } from "../schema/schema";

export type LoginData = z.infer<typeof loginSchema>