# Google Colab instructions

1. Download all pollie images: `npm run data:images:download`
2. Open `google_colab_gfpgan_inference_papermodel.py` in a new Google Colab
3. Run the initial colab *Preparations* code snippet
4. Skip to and run the *Upload images* snippet, use the created form to upload all the localy saved pollie images from step 1, above
6. Run the *Inference* snippet
7. Skip to and run the final *Download results* snippet
8. Once the zip file has downloaded, unzip it into the colab folder. Ensure the unzipped directory is named `results` and the `results/restored_imgs` directory is populated with the processed images