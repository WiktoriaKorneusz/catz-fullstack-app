using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MessagesController(IUnitOfWork unitOfWork) : BaseController
    {
        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(MessageCreateDto messageCreateDto)
        {
            var id = User.GetUserId();
            if (id == messageCreateDto.RecipientId)
                return BadRequest("You can't send messages to yourself");
            var sender = await unitOfWork.UserRepository.GetUserByIdAsync(id);
            var recipient = await unitOfWork.UserRepository.GetUserByIdAsync(messageCreateDto.RecipientId);
            if (recipient == null || sender == null) return BadRequest("Can't send message");
            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                // SenderUsername = sender.UserName,
                // RecipientUsername = recipient.UserName,
                Content = messageCreateDto.Content
            };
            unitOfWork.MessageRepository.AddMessage(message);
            if (await unitOfWork.Complete())
            {
                var createdMessage = await unitOfWork.MessageRepository.GetMessageAsync(message.Id);
                return CreatedAtAction(nameof(GetMessage), new { messageId = message.Id }, createdMessage);

            }
            return BadRequest("Failed to send message");
        }
        [HttpGet("{messageId:int}")]
        public async Task<ActionResult<MessageDto>> GetMessage(int messageId)
        {
            var message = await unitOfWork.MessageRepository.GetMessageAsync(messageId);
            return Ok(message);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.Id = User.GetUserId();
            var messages = await unitOfWork.MessageRepository.GetMessagesForUser(messageParams);

            Response.AddPaginationHeader(new PaginationHeader(messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages));
            return Ok(messages);
        }

        [HttpGet("thread/{targetId:int}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(int targetId)
        {
            var id = User.GetUserId();
            var messages = await unitOfWork.MessageRepository.GetMessageThread(id, targetId);
            if (unitOfWork.HasChanges()) await unitOfWork.Complete();

            return Ok(messages);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var userId = User.GetUserId();
            var message = await unitOfWork.MessageRepository.GetMessage(id);
            if (message == null) return BadRequest("Can't delete message");
            if (message.SenderId != userId && message.RecipientId != userId) return Forbid();

            if (message.RecipientId == userId) message.RecipientDeleted = true;
            if (message.SenderId == userId) message.SenderDeleted = true;

            // if (message.RecipientDeleted && message.SenderDeleted) unitOfWork.MessageRepository.DeleteMessage(message);
            if (message is { RecipientDeleted: true, SenderDeleted: true }) unitOfWork.MessageRepository.DeleteMessage(message);


            if (await unitOfWork.Complete()) return Ok();
            return BadRequest("Failed to delete message");

        }

        [HttpGet("load/{targetId:int}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> LoadMessages(int targetId, [FromQuery] int messagesCount = 0, [FromQuery] int batchSize = 4)
        {
            var id = User.GetUserId();
            var messages = await unitOfWork.MessageRepository.GetMessages(id, targetId, messagesCount, batchSize);
            return Ok(messages);


        }
        [HttpGet("count/{targetId:int}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> LoadMessages(int targetId)
        {
            var id = User.GetUserId();
            var count = await unitOfWork.MessageRepository.GetMessageCountAsync(id, targetId);
            return Ok(count);


        }

    }
}