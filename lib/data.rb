class Region
  def initialize
    @name
    @raw_region_data
    @raw_headers = get_data('name')
  end
  
  def circle_count(population, year)
    circle_count = population/20
  end
  
end

class DataParser
  def get_data(region_name)
    files = Dir.glob("data/wolf-data.csv")
    raw_lines = ''
    
    files.each do |file|
      raw_lines = IO.readlines(file)
    end

    raw_lines.each do |line|
      line.delete!("\n")
    end

    array_of_rows = raw_lines.each_slice(1).to_a
    array_of_split_rows = []
    array_of_rows.each do |row|
      array_of_split_rows << row[0].split(',')
    end
    
    array_of_split_rows.each do |row|
      if row.include?(region_name)
        return row
      end
    end
    
  end
  
end


files = Dir.glob("data/wolf-data.csv")

raw_lines = ''

files.each do |file|
  raw_lines = IO.readlines(file)
end

raw_lines.each do |line|
  line.delete!("\n")
end

array_of_rows = raw_lines.each_slice(1).to_a

array_of_split_rows = []
array_of_rows.each do |row|
  array_of_split_rows << row[0].split(',')
end

headers = array_of_split_rows[0]
northern_rockies = array_of_split_rows[1]
great_lakes = array_of_split_rows[2]
pac_nw = array_of_split_rows[3]
southwest = array_of_split_rows[4]

# array_of_rows.each do |row|
#   p column = row.transpose
# end

