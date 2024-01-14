use std::mem::size_of;

pub mod constants;
pub mod errors;
pub mod structs;
use crate::{constants::*, errors::*, structs::*};

use anchor_lang::prelude::*;

declare_id!("DuR2A1djtv4vvRgGC9uqntpFo1LQEEUduayDQjXM7qqY");

#[program]
pub mod solana_sanaol {
    use super::*;

    pub fn create_user(ctx: Context<CreateUser>) -> Result<()> {
        let user = &mut ctx.accounts.user;
        user.author = ctx.accounts.author.key();
        user.post_count = 0;
        user.last_post = 0;

        msg!("Created user: {}", user.author);

        Ok(())
    }

    pub fn create_post(ctx: Context<CreatePost>, title: String, content: String) -> Result<()> {
        let user_account = &mut ctx.accounts.user;
        let post_account = &mut ctx.accounts.post;

        require!(!title.len() > 50, ErrorCodes::TitleTooLong);
        require!(content.len() > 256, ErrorCodes::ContentTooLong);

        post_account.author = ctx.accounts.author.key();
        post_account.post_id = user_account.last_post;
        post_account.title = title;
        post_account.content = content;
        post_account.timestamp = ctx.accounts.timestamp.unix_timestamp;

        user_account.last_post = user_account.last_post.checked_add(1).unwrap();
        user_account.post_count = user_account.last_post.checked_add(1).unwrap();

        msg!(
            "Created post: '{}' by {}",
            post_account.title,
            user_account.author
        );

        msg!("User post count: {}", user_account.post_count);

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction()]
pub struct CreateUser<'info> {
    #[account(
        init,
        seeds = [USER, author.key().as_ref()],
        bump,
        payer = author,
        space = 8 + size_of::<UserAccount>()
    )]
    pub user: Box<Account<'info, UserAccount>>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct CreatePost<'info> {
    #[account(
        mut,
        seeds = [USER, author.key().as_ref()],
        bump
    )]
    pub user: Account<'info, UserAccount>,

    #[account(
        init,
        seeds = [POST, author.key().as_ref(), &[user.last_post as u8].as_ref()],
        bump,
        payer = author, space = 8 + size_of::<PostAccount>()
    )]
    pub post: Box<Account<'info, PostAccount>>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub timestamp: Sysvar<'info, Clock>,
    pub system_program: Program<'info, System>,
}

pub fn bump(seeds: &[&[u8]], program_id: &Pubkey) -> u8 {
    let (_found_key, bump) = Pubkey::find_program_address(seeds, program_id);
    bump
}

// #[derive(Accounts)]
// pub struct CreatePostLike<'info> {
//     #[account(
//         mut,
//         seeds = [b"post".as_ref()],
//         bump
//         )]
//     pub post: Account<'info, PostAccount>,

//     #[account(
//         init,
//         seeds = [b"post_like".as_ref(),author.key().as_ref(), post.key().as_ref()],
//         bump,
//         payer = author, space = size_of::<PostLikeAccount>() + 8)]
//     pub post_like: Account<'info, PostLikeAccount>,
//     #[account(mut)]
//     pub author: Signer<'info>,
//     pub system_program: Program<'info, System>,
// }

// #[account]
// pub struct UserAccount {
//     pub author: Pubkey,
//     pub username: String,
//     pub post_count: u64,
// }

// #[account]
// pub struct PostAccount {
//     pub author: Pubkey,
//     pub author_username: String,
//     pub post_id: u64,
//     pub timestamp: i64,
//     pub title: String,
//     pub content: String,
//     pub likes: i64,
// }

// #[account]
// pub struct PostLikeAccount {
//     pub author: Pubkey,
//     pub like: bool,
//     pub post_id: u64,
// }
