require 'csv'

class Parser

  def initialize
    @clean_lines = [];
  end

  # def get_data
  #   files = Dir.glob('data/uscities.csv')
  #   files.each do |file|
  #     raw_lines = IO.readlines(file)
  #
  #     raw_lines.each do |line|
  #       line.gsub!(/[a-zA-Z\s]/, "")
  #       @clean_lines << line[0..-2]
  #     end
  #   end
  #   @clean_lines
  # end

  # def csv_output
  #   CSV.open("data/precol-data.csv", "ab") do |csv|
  #     @clean_lines.each do |array|
  #       csv << [array]
  #     end
  #   end
  # end

  def add_frame
    files = Dir.glob('data/precol-data.csv')
    raw_lines = []
    files.each do |file|
      raw_lines = IO.readlines(file)
    end

    raw_lines.each do |line|
      random_frame = 1 + rand(10)
      line.gsub!("\n", ",#{random_frame}")
    end

    CSV.open("data/final-precol.csv", "ab") do |csv|
      raw_lines.each do |array|
        csv << [array]
      end
    end

  end

end

data = Parser.new
data.add_frame
# data.get_data
# data.csv_output
# data.split_string
