use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCodes {
    #[msg("The provided title should be 50 characters long maximum.")]
    TitleTooLong,
    #[msg("The provided content should be 280 characters long maximum.")]
    ContentTooLong,
    #[msg("The provided username should be 20 characters long maximum.")]
    UsernameTooLong,
}
