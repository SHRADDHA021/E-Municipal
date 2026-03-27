using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace EPortalApi.Migrations
{
    /// <inheritdoc />
    public partial class AddServiceRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RequiredDocs",
                table: "Services",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "ServiceRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Status = table.Column<string>(type: "text", nullable: false),
                    DocumentUrls = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IDNo = table.Column<int>(type: "integer", nullable: false),
                    SID = table.Column<int>(type: "integer", nullable: false),
                    Bill_ID = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ServiceRequests_Bill_Bill_ID",
                        column: x => x.Bill_ID,
                        principalTable: "Bill",
                        principalColumn: "Bill_ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ServiceRequests_Citizen_IDNo",
                        column: x => x.IDNo,
                        principalTable: "Citizen",
                        principalColumn: "IDNo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ServiceRequests_Services_SID",
                        column: x => x.SID,
                        principalTable: "Services",
                        principalColumn: "SID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ServiceRequests_Bill_ID",
                table: "ServiceRequests",
                column: "Bill_ID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServiceRequests_IDNo",
                table: "ServiceRequests",
                column: "IDNo");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceRequests_SID",
                table: "ServiceRequests",
                column: "SID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ServiceRequests");

            migrationBuilder.DropColumn(
                name: "RequiredDocs",
                table: "Services");
        }
    }
}
