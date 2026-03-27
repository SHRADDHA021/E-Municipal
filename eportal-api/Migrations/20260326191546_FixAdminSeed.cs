using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EPortalApi.Migrations
{
    /// <inheritdoc />
    public partial class FixAdminSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AdminUser",
                keyColumn: "Id",
                keyValue: 1);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AdminUser",
                columns: new[] { "Id", "Email", "Name", "PasswordHash", "Role" },
                values: new object[] { 1, "admin@emunicipal.com", "Super Admin", "7viNHfbGFmwOFsGxYNFBGqnRR/sPDnPxpMzrBLmO3G0=", "Admin" });
        }
    }
}
