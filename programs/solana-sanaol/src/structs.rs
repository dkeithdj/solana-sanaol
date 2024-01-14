use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct UserAccount {
    pub author: Pubkey,
    pub last_post: u8,
    pub post_count: u8,
}

#[account]
#[derive(Default)]
pub struct PostAccount {
    pub author: Pubkey,
    pub author_username: String,
    pub post_id: u8,
    pub timestamp: i64,
    pub title: String,
    pub content: String,
}

// #[account]
// pub struct PostLikeAccount {
//     pub author: Pubkey,
//     pub like: bool,
//     pub post_id: u64,
// }
