module.exports = {
  requires: {
    bundle: "ai",
  },
  run: [
    {
      method: "shell.run",
      params: {
        message: "git clone https://github.com/Comfy-Org/ComfyUI app"
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "uv pip install -r requirements.txt",
          "uv pip install -r manager_requirements.txt",
          "uv pip install -U bitsandbytes"
        ]
      }
    },
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: "env",
          path: "app",
          // xformers: true
        }
      }
    },
    {
      "method": "fs.link",
      "params": {
        "drive": {
          "diffusion_models": "app/models/diffusion_models",
          "text_encoders": "app/models/text_encoders",
          "latent_upscale_models": "app/models/latent_upscale_models",
          "audio_encoders": "app/models/audio_encoders",
          "checkpoints": "app/models/checkpoints",
          "clip": "app/models/clip",
          "clip_vision": "app/models/clip_vision",
          "configs": "app/models/configs",
          "controlnet": "app/models/controlnet",
          "embeddings": "app/models/embeddings",
          "loras": "app/models/loras",
          "model_patches": "app/models/model_patches",
          "upscale_models": "app/models/upscale_models",
          "vae": "app/models/vae",
          "vae_approx": "app/models/vae_approx",
          "diffusers": "app/models/diffusers",
          "unet": "app/models/unet",
          "hypernetworks": "app/models/hypernetworks",
          "gligen": "app/models/gligen",
          "style_models": "app/models/style_models",
          "photomaker": "app/models/photomaker"
        },
        "peers": [
          "https://github.com/cocktailpeanut/fluxgym.git",
          "https://github.com/cocktailpeanutlabs/automatic1111.git",
          "https://github.com/cocktailpeanutlabs/fooocus.git",
          "https://github.com/cocktailpeanutlabs/comfyui.git",
          "https://github.com/pinokiofactory/comfy.git",
          "https://github.com/pinokiofactory/stable-diffusion-webui-forge.git",
          "https://github.com/pinokiofactory/MagicQuill.git",
          "https://github.com/6Morpheus6/forge-neo.git"
        ]
      }
    },
    {
      "method": "fs.link",
      "params": {
        "drive": {
          "output": "app/output"
        }
      }
    },
  ]
}
