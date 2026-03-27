using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EPortalApi.Migrations
{
    /// <inheritdoc />
    public partial class AbsoluteFinalFixBillNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bill_Citizen_IDNo",
                table: "Bill");

            migrationBuilder.AlterColumn<int>(
                name: "IDNo",
                table: "Bill",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Bill_Citizen_IDNo",
                table: "Bill",
                column: "IDNo",
                principalTable: "Citizen",
                principalColumn: "IDNo",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bill_Citizen_IDNo",
                table: "Bill");

            migrationBuilder.AddForeignKey(
                name: "FK_Bill_Citizen_IDNo",
                table: "Bill",
                column: "IDNo",
                principalTable: "Citizen",
                principalColumn: "IDNo",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
