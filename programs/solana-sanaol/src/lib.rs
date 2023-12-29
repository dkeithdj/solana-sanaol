use std::mem::size_of;

use anchor_lang::prelude::*;

pub mod error;
use crate::error::ErrorCode;
declare_id!("DuR2A1djtv4vvRgGC9uqntpFo1LQEEUduayDQjXM7qqY");

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const LIKE_LENGTH: usize = 8;
const STRING_LENGTH_PREFIX: usize = 4; // Stores the size of the string.
const MAX_TITLE_LENGTH: usize = 50 * 4; // 50 chars max.
const MAX_CONTENT_LENGTH: usize = 280 * 4; // 280 chars max.
const MAX_USERNAME_LENGTH: usize = 20 * 4; // 20 chars max.

#[program]
pub mod solana_sanaol {
    use super::*;

    pub fn create_user(ctx: Context<CreateUser>, username: String) -> Result<()> {
        let user = &mut ctx.accounts.user;

        if username.chars().count() > 20 {
            return Err(ErrorCode::UsernameTooLong.into());
        }

        user.author = ctx.accounts.author.key();
        user.username = username;

        Ok(())
    }

    pub fn create_posts(ctx: Context<CreatePosts>) -> Result<()> {
        let posts = &mut ctx.accounts.posts;
        posts.post_count = 0;

        Ok(())
    }

    pub fn create_post(ctx: Context<CreatePost>, title: String, content: String) -> Result<()> {
        let posts = &mut ctx.accounts.posts;

        let user = &mut ctx.accounts.user;
        let post = &mut ctx.accounts.post;

        if title.chars().count() > 50 {
            return Err(ErrorCode::TitleTooLong.into());
        }

        if content.chars().count() > 280 {
            return Err(ErrorCode::ContentTooLong.into());
        }

        posts.post_count += 1;

        post.author = ctx.accounts.author.key();
        post.title = title;
        post.content = content;
        post.timestamp = ctx.accounts.timestamp.unix_timestamp;
        post.author_username = user.username.clone();
        post.likes = 0;

        Ok(())
    }

    pub fn create_post_like(ctx: Context<CreatePostLike>, post_id: u64, like: bool) -> Result<()> {
        let post = &mut ctx.accounts.post;
        let post_like = &mut ctx.accounts.post_like;

        post_like.author = ctx.accounts.author.key();
        post_like.like = like;
        post_like.post_id = post_id;

        if like {
            post.likes += 1;
        } else {
            post.likes -= 1;
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateUser<'info> {
    #[account(
        init,
        seeds = [b"user".as_ref(), author.key().as_ref()],
        bump,
        payer = author, space = UserAccount::LEN)]
    pub user: Account<'info, UserAccount>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreatePosts<'info> {
    #[account(
        init,
        seeds = [b"posts".as_ref()],
        bump,
        payer = author, space = size_of::<PostsAccount>() + 8)]
    pub posts: Account<'info, PostsAccount>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreatePost<'info> {
    #[account(
        mut,
        seeds = [b"user".as_ref(), author.key().as_ref()],
        bump
        )]
    pub user: Account<'info, UserAccount>,

    #[account(
        mut,
        seeds = [b"posts".as_ref()],
        bump
        )]
    pub posts: Account<'info, PostsAccount>,

    #[account(
        init,
        seeds = [b"post".as_ref(), posts.post_count.to_be_bytes().as_ref()],
        bump,
        payer = author, space = PostAccount::LEN)]
    pub post: Account<'info, PostAccount>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub timestamp: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
#[instruction(post_id: u64)]
pub struct CreatePostLike<'info> {
    #[account(
        mut,
        seeds = [b"post".as_ref(), post_id.to_be_bytes().as_ref()],
        bump
        )]
    pub post: Account<'info, PostAccount>,

    #[account(
        init,
        seeds = [b"post_like".as_ref(),author.key().as_ref(), post_id.to_be_bytes().as_ref()],
        bump,
        payer = author, space = size_of::<PostLikeAccount>() + 8)]
    pub post_like: Account<'info, PostLikeAccount>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct UserAccount {
    pub author: Pubkey,
    pub username: String,
}

#[account]
pub struct PostsAccount {
    pub post_count: u64,
}

#[account]
pub struct PostAccount {
    pub author: Pubkey,
    pub author_username: String,
    pub timestamp: i64,
    pub title: String,
    pub content: String,
    pub likes: i64,
}

#[account]
pub struct PostLikeAccount {
    pub author: Pubkey,
    pub like: bool,
    pub post_id: u64,
}

impl UserAccount {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Author.
        + STRING_LENGTH_PREFIX + MAX_USERNAME_LENGTH; // Username.
}

impl PostAccount {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Author.
        + TIMESTAMP_LENGTH // Timestamp.
        + STRING_LENGTH_PREFIX + MAX_TITLE_LENGTH // Topic.
        + STRING_LENGTH_PREFIX + MAX_CONTENT_LENGTH // Content.
        + LIKE_LENGTH; // Likes.
}
