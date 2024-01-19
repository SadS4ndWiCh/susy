import { init } from "@paralleldrive/cuid2";

const createId = init({ length: 10 });

export function createSusy() {
  const _id = createId();

  return _id.concat("-").concat("sus.mp4")
}