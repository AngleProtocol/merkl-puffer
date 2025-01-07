import type { ActionFunctionArgs } from "@remix-run/node";
import { loader } from "src/routes/_merkl.users.$address";

export async function action({ params, request, context }: ActionFunctionArgs) {
  return loader({ params, request, context });
}
