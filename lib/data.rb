require 'csv'

class DataParser

  attr_accessor :target_data

  def initialize(target_data)
    @target_data = get_data(target_data)
  end

  def get_data(region_name)
    files = Dir.glob("data/population_data.csv")
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
        return row[1..-1]
      end
    end

  end

end

test = DataParser.new("GLakes")


class Region
  attr_accessor :population_data, :circle_count, :coordinate_count, :headers, :generate_years_arrays, :generate_radius_arrays, :randomize_radius

  def initialize(region)
    @name
    @population_data = DataParser.new(region)
    @headers = DataParser.new("name").target_data
    @circle_counts = []
  end

  def circle_count
    @population_data.target_data.each do |year|
      _year = year.to_i
      if _year > 0 && _year < 10
        @circle_counts << 1
      elsif _year >= 10 && _year < 20
        @circle_counts << 2
      else
        @circle_counts << _year / 20
      end
    end
    @circle_counts
  end

  def coordinate_count
    circle_count.max
  end
  
  def generate_years_arrays
    years_array = []
    @headers.each do |year|
      years_array << [year]
    end
    years_array
  end
  
  def randomize_radius
    rand(2..20)
  end

  def generate_radius_arrays
    radius_arrays = generate_years_arrays
    shuffled_radius_arrays = []
    radius_arrays.each_with_index do |array, index|
      circle_count[index].times do # for each year, fill in the number of circles that will have a radius > 0
        array << randomize_radius
      end
      ((coordinate_count + 1) - array.length).times do
        array << 0 # then, for each year, fill in the rest (up through coordinate_count number of coordinates) with zeros
      end
      shuffled_array = array[1..-1].shuffle!
      shuffled_array.unshift(array[0])
      shuffled_radius_arrays << shuffled_array
    end
    shuffled_radius_arrays
  end
  
  def transpose_radius_arrays
    generate_radius_arrays.transpose
  end
  
  def generate_csv
    CSV.open("data/output.csv", "w") do |csv|
      transpose_radius_arrays.each do |array|
        csv << array
      end
    end
  end

end

# test_1 = Region.new("GLakes")
test_1 = Region.new("NRockies")
# test_1 = Region.new("PacNW")
# test_1.generate_radius_arrays
# p test_1.circle_count
# p test_1.transpose_radius_arrays
# p test_1.coordinate_count
test_1.generate_csv
