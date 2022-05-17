# Data instructions

1. Register for an API key @ https://theyvoteforyou.org.au/help/data#key
2. Rename `credentials.example.json` to `credentials.json` and paste in the API key
3. Prepare the database: `npm run data:db`
4. Download the images: `npm run data:images:download` 
5. Run google colab `data/images/colab/readme.md` 
6. Optimise images: `npm run data:images:optimise`
