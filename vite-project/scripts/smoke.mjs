import { Client } from "@gradio/client";

async function main() {
  const client = await Client.connect("Santhosh737/Indic-Classify");
  const res = await client.predict("/predict", {
    text: "ಬೆಂಗಳೂರು ನಗರದಲ್ಲಿ ಇಂದು ಮಳೆ",
    model_choice: "DistilBERT",
  });
  console.log("Raw response:\n", res);
  console.log("data:", res?.data);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
