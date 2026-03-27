using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EPortalApi.Migrations
{
    /// <inheritdoc />
    public partial class FinalFixBillNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BillType",
                table: "Bill",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CitizenName",
                table: "Bill",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConsumerNumber",
                table: "Bill",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DueDate",
                table: "Bill",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BillType",
                table: "Bill");

            migrationBuilder.DropColumn(
                name: "CitizenName",
                table: "Bill");

            migrationBuilder.DropColumn(
                name: "ConsumerNumber",
                table: "Bill");

            migrationBuilder.DropColumn(
                name: "DueDate",
                table: "Bill");
        }
    }
}
