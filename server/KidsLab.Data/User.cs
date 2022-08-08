using System;

namespace KidsLab.Data
{
    public class User
    {
        /// <summary>
        /// User ID, generated server-side.
        /// </summary>
        public Guid Id { get; set; }

        public string Name { get; set; }

        /// <summary>
        /// User's chosen color, in hex value
        /// </summary>
        public string Color { get; set; }

        /// <summary>
        /// Unicode icon character
        /// </summary>
        public string Icon { get; set; }

        /// <summary>
        /// Age, in years
        /// </summary>
        public short Age { get; set; }
    }
}

