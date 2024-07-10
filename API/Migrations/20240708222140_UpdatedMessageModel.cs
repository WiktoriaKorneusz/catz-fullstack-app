using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedMessageModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RecipientUsername",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "SenderUsername",
                table: "Messages");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RecipientUsername",
                table: "Messages",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SenderUsername",
                table: "Messages",
                type: "TEXT",
                nullable: true);
        }
    }
}
