Contributions to The Daily Dad Joke are welcome and encouraged! If you have any ideas, suggestions, or bug reports, please open an issue on the GitHub repository.

1. Fork the repository on GitHub.
2. Clone your forked repository to your local machine.
3. Create a new branch: `git checkout -b my-feature-branch`.
4. Make your changes and commit them: `git commit -m 'Add new feature'`.
5. Push the changes to your forked repository: `git push origin my-feature-branch`.
6. Open a pull request on the original repository, describing your changes in detail.

### Running locally

You'll need to create a local [Supabase](https://supabase.com/) database and create a `jokes` table following the docs for Local Development

https://supabase.com/docs/guides/getting-started/local-development

Required environment variables:

- `SUPABASE_URL`: [Link](https://app.supabase.com/sign-in?returnTo=%2Fproject%2F_%2Fsettings%2Fapi)
- `SUPABASE_KEY`: [Link](https://app.supabase.com/sign-in?returnTo=%2Fproject%2F_%2Fsettings%2Fapi)
- `OPENAI_API_KEY` [Link](https://platform.openai.com/account/api-keys)
