use std::mem::size_of;

use anchor_lang::prelude::*;

pub mod error;
use crate::error::ErrorCode;
declare_id!("DuR2A1djtv4vvRgGC9uqntpFo1LQEEUduayDQjXM7qqY");

// create_post
// update_post

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
        let user: &mut UserAccount = &mut ctx.accounts.user;
        let author: &Signer = &ctx.accounts.author;

        if username.chars().count() > 20 {
            return Err(ErrorCode::UsernameTooLong.into());
        }

        user.author = *author.key;
        user.username = username;

        Ok(())
    }

    pub fn create_posts(ctx: Context<CreatePosts>) -> Result<()> {
        // let author: &Signer = &ctx.accounts.author;
        let posts: &mut PostsAccount = &mut ctx.accounts.posts;
        posts.post_count = 0;

        Ok(())
    }

    // pub fn create_post(ctx: Context<CreatePost>, title: String, content: String) -> Result<()> {
    //     let post: &mut PostAccount = &mut ctx.accounts.post;
    //     let author: &Signer = &ctx.accounts.author;
    //     let clock: Clock = Clock::get().unwrap();

    //     if title.chars().count() > 50 {
    //         return Err(ErrorCode::TitleTooLong.into());
    //     }

    //     if content.chars().count() > 280 {
    //         return Err(ErrorCode::ContentTooLong.into());
    //     }

    //     post.author = *author.key;
    //     post.timestamp = clock.unix_timestamp;
    //     post.title = title;
    //     post.content = content;

    //     Ok(())
    // }
}

#[derive(Accounts)]
pub struct CreateUser<'info> {
    #[account(init,
        seeds = [b"user".as_ref(), author.key().as_ref()],
        bump,
         payer = author, space = UserAccount::LEN)]
    pub user: Account<'info, UserAccount>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct UserAccount {
    pub author: Pubkey,
    pub username: String,
}

#[derive(Accounts)]
pub struct CreatePosts<'info> {
    #[account(init,
        seeds = [b"posts".as_ref()],
        bump,
         payer = author, space = size_of::<PostsAccount>() + 8)]
    pub posts: Account<'info, PostsAccount>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct PostsAccount {
    pub post_count: u64,
}

// #[derive(Accounts)]
// pub struct CreatePost<'info> {
//     #[account(init,
//         seeds = [b"post".as_ref(), author.key().as_ref()],
//         bump,
//          payer = author, space = PostAccount::LEN)]
//     pub post: Account<'info, PostAccount>,
//     #[account(mut)]
//     pub author: Signer<'info>,
//     pub system_program: Program<'info, System>,
// }

// #[account]
// pub struct PostAccount {
//     pub author: Pubkey,
//     pub timestamp: i64,
//     pub title: String,
//     pub content: String,
//     pub likes: i64,
// }

// #[account]
// pub struct LikeCount {
//     pub author: Pubkey,
// }

// #[account]
// pub struct LikeAccount {
//     pub author: Pubkey,
// }

impl UserAccount {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Author.
        + STRING_LENGTH_PREFIX + MAX_USERNAME_LENGTH; // Username.
}

// impl PostAccount {
//     const LEN: usize = DISCRIMINATOR_LENGTH
//         + PUBLIC_KEY_LENGTH // Author.
//         + TIMESTAMP_LENGTH // Timestamp.
//         + STRING_LENGTH_PREFIX + MAX_TITLE_LENGTH // Topic.
//         + STRING_LENGTH_PREFIX + MAX_CONTENT_LENGTH // Content.
//         + LIKE_LENGTH; // Likes.
// }
